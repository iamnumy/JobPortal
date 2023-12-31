import React, {useState, useContext} from 'react';
import { Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide } from '@mui/material';
import {UserContext} from "../UserContext/UserContext";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import { ToastContainer } from 'react-toastify';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const JobCard = ({ id, postedOn, title, type, location, companyName, company_id, link, skills, experience, qualification,shift, description, ...jobDetails }) => {
    const [open, setOpen] = useState(false);
    const { user, isLoading } = useContext(UserContext);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleApply = () => {

        const apiUrl = 'https://job-portal-backend-two.vercel.app/api/apply-job';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                title: title,
                company_id: company_id,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    // If the response status is not ok (status 200), handle the error
                    throw new Error('Failed to apply for the job');
                }
                return response.json();
            })
            .then(data => {
                toast.success(data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    onClose: () => {
                        // Reload the page after a successful application
                        window.location.reload();
                    }
                });
                console.log('Job application submitted successfully:', data);
                // Note: You can also add additional logic here if needed before reloading
            })
            .catch(error => {
                console.error('Error submitting job application:', error);

                if (error.message === 'You have already applied for this job.') {
                    // Show a toast for the specific error message
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_CENTER,
                        onClose: () => {
                            // You can add additional logic here if needed
                        }
                    });
                } else {
                    // For other errors, you can handle them as needed
                    // For now, just log the error to the console
                    console.error(error);
                }
            });
    };



    const dateObject = new Date(postedOn);
    const formattedDate = dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return (
    <>
        <ToastContainer />
      <Box p={2} mb={2} sx={{
          border: '1px solid #e8e8e8',
          transition: '.3s ease',
          backgroundColor: 'background.paper',
          "&:hover": {
              boxShadow: '0px 5px 25px rgba(0,0,0,0.1)',
              borderLeft: '6px solid #00668c',
              backgroundColor: '#d4eaf7'
          }
      }}>
        {/* Set the outer Grid as a container */}
        <Grid container spacing={2} alignItems="center">
          {/* First Grid item for the job title and company */}
          <Grid item xs={12} sm={4}>
            <Typography variant='subtitle1'>{title}</Typography>
            <Typography sx={{
              fontsize: '13.5px',
              backgroundColor: 'primary.main',
              padding: '6px',
              borderRadius: '5px',
              display: 'inline-block',
              fontweight: 'bold'
            }} variant='subtitle1'>{companyName}</Typography>
          </Grid>
            <Grid item xs={12} sm={4}>
                <Grid container spacing={1}>
                    {skills.map((skill, index) => (
                        <Grid sx={{
                            margin: '4px',
                            padding: '6px',
                            fontSize: '14.5px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            backgroundColor: 'text.secondary',
                            color: 'background.default'
                        }} key={index} item>
                            <Typography>{skill}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
          <Grid item xs={12} sm={4} container direction="column" alignItems="flex-end">
            <Grid item>
              <Typography variant='caption2'>{formattedDate} | {type} | {location}</Typography>
            </Grid>
            <Grid item>
              <Box mt={2}>
                <Button variant="outlined" onClick={handleOpen} disableElevation>
                  Check
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* Dialog for Job Details */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="job-details-description"
        >
      <DialogTitle>{title}</DialogTitle>
          <DialogContent>
              <DialogContentText id="job-details-description">
                  <Typography gutterBottom>Job Summary: {description}</Typography> {/* Updated this line */}
                  <Typography gutterBottom>Qualifications: {qualification}</Typography>
                  <Typography gutterBottom>Experience: {experience}</Typography>
                  <Typography gutterBottom>Shift: {shift}</Typography>
                  <Typography gutterBottom>Location: {location}</Typography>
              </DialogContentText>
          </DialogContent>
      <DialogActions>
          {user && user.role === 'student' && (
          <Button color="primary" variant="contained" onClick={handleApply}>
                        Apply
          </Button>
          )}
          <Button color="secondary" onClick={handleClose}>Close</Button>
      </DialogActions>
      </Dialog>
      </>
  );
};

export default JobCard;
