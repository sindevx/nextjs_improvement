import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { supabase } from '@/utils/supabaseClient';

interface RichTextEditorProps {
  initialValue: string;
  onEditorChange: (content: string) => void;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  initialValue, 
  onEditorChange,
  disabled = false 
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  useEffect(() => {
    // Update editor content when initialValue changes
    if (editorRef.current && initialValue !== editorRef.current.getContent()) {
      editorRef.current.setContent(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="min-h-[400px] w-full">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => {
          editorRef.current = editor;
          // Set initial content after editor is initialized
          if (initialValue) {
            editor.setContent(initialValue);
          }
        }}
        value={initialValue}
        onEditorChange={(content, editor) => {
          onEditorChange(content);
        }}
        disabled={disabled}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
            'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image media | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size: 16px }',
          image_advtab: true,
          images_upload_handler: async (blobInfo) => {
            try {
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename());
              
              const fileExt = blobInfo.filename().split('.').pop();
              const fileName = `${Date.now()}.${fileExt}`;
              
              const { data, error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(fileName, blobInfo.blob());

              if (uploadError) throw uploadError;

              const { data: { publicUrl } } = supabase.storage
                .from('post-images')
                .getPublicUrl(fileName);

              return publicUrl;
            } catch (error) {
              console.error('Upload error:', error);
              throw new Error('Failed to upload image');
            }
          }
        }}
      />
    </div>
  );
};

export default RichTextEditor;