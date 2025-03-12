import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { PlatformSelect } from "@/components/posts/platform-select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, Plus, X, Image, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, type PostFormValues } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { SocialAccount } from "@shared/schema";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: accounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
  });

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
      platforms: [],
      mediaUrls: [],
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      return apiRequest('POST', '/api/posts', data);
    },
    onSuccess: () => {
      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/upcoming'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostFormValues) => {
    let scheduledFor = undefined;
    
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      scheduledFor = new Date(selectedDate);
      scheduledFor.setHours(hours, minutes);
    }
    
    createPostMutation.mutate({
      ...data,
      scheduledFor: scheduledFor || null,
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    const updatedFiles = [...selectedMedia, ...newFiles];
    setSelectedMedia(updatedFiles);
    
    // Create preview URLs for the new files
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setMediaPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Add the file names to the form
    const updatedMediaUrls = [...(form.getValues("mediaUrls") || []), ...newFiles.map(file => file.name)];
    form.setValue("mediaUrls", updatedMediaUrls);
  };
  
  const removeMedia = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    
    // Remove the file and its preview
    const updatedFiles = selectedMedia.filter((_, i) => i !== index);
    const updatedPreviews = mediaPreviewUrls.filter((_, i) => i !== index);
    const updatedMediaUrls = form.getValues("mediaUrls")?.filter((_, i) => i !== index) || [];
    
    setSelectedMedia(updatedFiles);
    setMediaPreviewUrls(updatedPreviews);
    form.setValue("mediaUrls", updatedMediaUrls);
  };
  
  // Handle drag and drop functionality
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    // Filter for image files
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) return;
    
    const updatedFiles = [...selectedMedia, ...imageFiles];
    setSelectedMedia(updatedFiles);
    
    // Create preview URLs
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setMediaPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Add file names to the form
    const updatedMediaUrls = [...(form.getValues("mediaUrls") || []), ...imageFiles.map(file => file.name)];
    form.setValue("mediaUrls", updatedMediaUrls);
  }, [selectedMedia, form]);

  const charactersRemaining = 2200 - (form.watch("content")?.length || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platforms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platforms</FormLabel>
                  <FormControl>
                    <PlatformSelect 
                      accounts={accounts}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="What would you like to share?" 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="mt-1 text-sm text-gray-500">{charactersRemaining} characters remaining</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mediaUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media</FormLabel>
                  <div className="space-y-4">
                    {mediaPreviewUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                        {mediaPreviewUrls.map((url, index) => (
                          <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 group">
                            <img 
                              src={url} 
                              alt={`Media ${index + 1}`}
                              className="h-24 w-full object-cover" 
                            />
                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-primary bg-primary/5' : mediaPreviewUrls.length > 0 ? 'border-gray-200' : 'border-gray-300'} border-dashed rounded-md transition-colors`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only"
                              accept=".png,.jpg,.jpeg,.gif"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Schedule</FormLabel>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1">
                  <div className="flex items-center w-full">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={handleTimeChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </FormItem>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createPostMutation.isPending}
              >
                {selectedDate && selectedTime ? 'Schedule Post' : 'Save as Draft'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
