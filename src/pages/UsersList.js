import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Box,
  Alert,
} from '@mui/material';
import { getUsers, updateUser, deleteUser } from '../services/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await getUsers(page);
      setUsers(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      setMessage({ text: 'Failed to fetch users', type: 'error' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  const handleUpdate = async () => {
    try {
      await updateUser(editUser.id, {
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
      });
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === editUser.id ? { ...user, ...editUser } : user
      ));
      setMessage({ text: 'User updated successfully', type: 'success' });
      setEditUser(null);
    } catch (error) {
      setMessage({ text: 'Failed to update user', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      // Remove the user from local state
      setUsers(users.filter(user => user.id !== id));
      setMessage({ text: 'User deleted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete user', type: 'error' });
    }
  };

  const filteredUsers = searchTerm.trim() === '' 
    ? users 
    : users.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users List
        </Typography>
        
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ text: '', type: '' })}>
            {message.text}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Search users"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      onClick={() => handleEdit(user)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>

      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <>
              <TextField
                fullWidth
                label="First Name"
                value={editUser.first_name}
                onChange={(e) =>
                  setEditUser({ ...editUser, first_name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                value={editUser.last_name}
                onChange={(e) =>
                  setEditUser({ ...editUser, last_name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersList;
