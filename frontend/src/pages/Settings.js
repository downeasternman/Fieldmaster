import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useUserSettings } from '../contexts/UserSettingsContext';

const FONT_CHOICES = [
  'Roboto', 'Arial', 'Lato', 'Open Sans', 'Montserrat', 'Source Sans Pro',
  'Nunito', 'Raleway', 'Ubuntu', 'Merriweather', 'Inter', 'Georgia'
];

const Settings = () => {
  const { userSettings, setUserSettings } = useUserSettings();
  const [settings, setSettings] = useState({ sales_tax_rate: 0.0825 });
  const [technicians, setTechnicians] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchTechnicians();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/settings/');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/technicians/');
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  // User-specific theme/font
  const handleUserSettingsChange = async (newSettings) => {
    setUserSettings(newSettings);
    try {
      await fetch('http://localhost:8000/api/user-settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSettings),
      });
    } catch (error) {
      // Optionally show error
    }
  };

  const handleSettingsChange = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleTechnicianChange = async (technician) => {
    try {
      const updatedTechnician = {
        labor_rate: technician.labor_rate,
        phone: technician.phone,
        is_available: technician.is_available
      };
      const response = await fetch(`http://localhost:8000/api/technicians/${technician.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTechnician),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchTechnicians();
      } else {
        const errorData = await response.json();
        console.error('Error updating technician:', errorData);
      }
    } catch (error) {
      console.error('Error updating technician:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings updated successfully!
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sales Tax Rate"
                    type="number"
                    value={settings.sales_tax_rate}
                    onChange={(e) => setSettings({
                      ...settings,
                      sales_tax_rate: parseFloat(e.target.value)
                    })}
                    InputProps={{ inputProps: { min: 0, max: 1, step: 0.0001 } }}
                    helperText="Enter as decimal (e.g., 0.0825 for 8.25%)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userSettings.theme === 'dark'}
                        onChange={(e) => handleUserSettingsChange({
                          ...userSettings,
                          theme: e.target.checked ? 'dark' : 'light'
                        })}
                      />
                    }
                    label="Dark Theme"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="font-label">Font</InputLabel>
                    <Select
                      labelId="font-label"
                      value={userSettings.font}
                      label="Font"
                      onChange={(e) => handleUserSettingsChange({
                        ...userSettings,
                        font: e.target.value
                      })}
                    >
                      {FONT_CHOICES.map((font) => (
                        <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSettingsChange}
                  >
                    Save Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Technician Labor Rates
              </Typography>
              {technicians.map((technician) => (
                <React.Fragment key={technician.id}>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        {technician.user.first_name} {technician.user.last_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Labor Rate"
                        type="number"
                        value={technician.labor_rate}
                        onChange={(e) => {
                          const updatedTechnician = {
                            ...technician,
                            labor_rate: parseFloat(e.target.value)
                          };
                          handleTechnicianChange(updatedTechnician);
                        }}
                        InputProps={{
                          startAdornment: '$',
                          inputProps: { min: 0, step: 0.01 }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings; 