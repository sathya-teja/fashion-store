// Profile.jsx (Myntra-style with Loyalty, Verification, Last Login)
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import {
  ShoppingBag,
  Favorite,
  LocationOn,
  Logout,
  ChevronRight,
  Settings,
  Star,
  Verified,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    loyaltyPoints: 0,
    isVerified: false,
    lastLogin: null,
  });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile({
            name: data.name,
            email: data.email,
            loyaltyPoints: data.loyaltyPoints || 0,
            isVerified: data.isVerified || false,
            lastLogin: data.lastLogin || null,
          });
          setEditProfile({ name: data.name, email: data.email, password: "" });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userInfo, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(editProfile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setProfile((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
      setOpenDialog(false);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (!userInfo)
    return (
      <Box textAlign="center" mt={6}>
        <Typography>Please log in to view your profile.</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Box>
    );

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 10 }} >
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <Avatar
          sx={{
            width: 90,
            height: 90,
            mx: "auto",
            bgcolor: "grey.400",
            fontSize: 36,
          }}
        >
          {profile?.name?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <Typography variant="h6" mt={1}>
          {profile.name}
        </Typography>
        <Typography color="text.secondary">{profile.email}</Typography>
        <Typography color="success.main" fontWeight="bold" mt={1}>
          Loyalty Points: {profile.loyaltyPoints}
        </Typography>
        {profile.isVerified ? (
          <Typography color="primary" display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Verified fontSize="small" /> Verified
          </Typography>
        ) : (
          <Typography color="error">Not Verified</Typography>
        )}
        {profile.lastLogin && (
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Last login: {new Date(profile.lastLogin).toLocaleString()}
          </Typography>
        )}
      </Box>

      {/* Options List */}
      <List sx={{ bgcolor: "white", borderRadius: 1 }}>
        <ListItem button component={Link} to="/orders">
          <ListItemIcon>
            <ShoppingBag color="primary" />
          </ListItemIcon>
          <ListItemText primary="Orders" secondary="Check your order status" />
          <ChevronRight />
        </ListItem>
        <Divider />

        <ListItem button component={Link} to="/wishlist">
          <ListItemIcon>
            <Favorite color="error" />
          </ListItemIcon>
          <ListItemText primary="Wishlist" secondary="Your saved items" />
          <ChevronRight />
        </ListItem>
        <Divider />

        <ListItem button component={Link} to="/addresses">
          <ListItemIcon>
            <LocationOn color="success" />
          </ListItemIcon>
          <ListItemText primary="Addresses" secondary="Manage shipping addresses" />
          <ChevronRight />
        </ListItem>
        <Divider />

        <ListItem>
          <ListItemIcon>
            <Star color="warning" />
          </ListItemIcon>
          <ListItemText
            primary="Rewards & Loyalty"
            secondary={`${profile.loyaltyPoints} points available`}
          />
          <ChevronRight />
        </ListItem>
        <Divider />

        <ListItem button onClick={() => setOpenDialog(true)}>
          <ListItemIcon>
            <Settings color="action" />
          </ListItemIcon>
          <ListItemText primary="Account Settings" secondary="Edit profile details" />
          <ChevronRight />
        </ListItem>
        <Divider />

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <Logout color="action" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
          <ChevronRight />
        </ListItem>
      </List>

      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={editProfile.name}
              onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={editProfile.email}
              onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={editProfile.password}
              onChange={(e) => setEditProfile({ ...editProfile, password: e.target.value })}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
