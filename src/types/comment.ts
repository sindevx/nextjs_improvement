// types/comment.ts
export interface Comment {
    id: string;
    content: string;
    images: string[];
    created_at: string;
    user_id: string;
    post_id: string;
    user: {
        email: string;
        raw_user_meta_data: {
            full_name?: string;
            avatar_url?: string;
        }
    }
}