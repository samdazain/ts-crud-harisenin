import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addNewPost, updatePost } from './postSlice';
import { TextField, Button, Stack } from '@mui/material';

interface PostFormProps {
    currentPost?: { id: number; title: string; body: string; userId: number };
    onClose: () => void;
    onSnackbar: (message: string) => void; // Callback to trigger snackbar
}

const PostForm: React.FC<PostFormProps> = ({ currentPost, onClose, onSnackbar }) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    // Populate the form fields with the current post data if available
    useEffect(() => {
        if (currentPost) {
            setTitle(currentPost.title);
            setBody(currentPost.body);
        }
    }, [currentPost]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentPost) {
            dispatch(updatePost({ id: currentPost.id, title, body, userId: currentPost.userId }));
            onSnackbar('Post updated successfully.');
        } else {
            const newPost = { id: Date.now(), title, body, userId: 1 }; // Temporary id for new post
            dispatch(addNewPost(newPost));
            onSnackbar('Post created successfully.');
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    {currentPost ? 'Update' : 'Add'}
                </Button>
            </Stack>
        </form>
    );
};

export default PostForm;
