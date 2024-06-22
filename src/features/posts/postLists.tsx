import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPosts, deletePost } from './postSlice';
import { CircularProgress, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PostForm from './PostForm';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Post } from '../../types/post';

interface PostListProps {
  onSnackbar: (message: string) => void; // Callback to trigger snackbar
}

const PostList: React.FC<PostListProps> = ({ onSnackbar }) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const status = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);

  const [editingPost, setEditingPost] = useState<null | Post>(null); // Post being edited

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleDelete = (postId: number) => {
    dispatch(deletePost(postId));
    onSnackbar('Post deleted successfully.');
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post); // Set the post to be edited
  };

  const handleClose = () => {
    setEditingPost(null);
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <List>
        {posts.map((post) => (
          <ListItem
            key={post.id}
            sx={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              margin: '8px 0',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: '#333' }}>
                  {post.title}
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#555' }}>
                  {post.body}
                </Typography>
              }
            />
            <IconButton
              edge="end"
              color="primary"
              onClick={() => handleEdit(post)}
              sx={{
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              color="secondary"
              onClick={() => handleDelete(post.id)}
              sx={{
                color: '#d32f2f',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Dialog for editing posts */}
      <Dialog open={Boolean(editingPost)} onClose={handleClose}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          {editingPost && (
            <PostForm
              currentPost={editingPost}
              onClose={handleClose}
              onSnackbar={onSnackbar}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostList;
