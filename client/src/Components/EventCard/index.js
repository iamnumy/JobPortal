import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

const EventCard = ({ event }) => {
    return (
        <Card sx={{mb:3}}>
            <CardMedia
                component="img"
                height="140"
                image={event.imageUrl}
                alt={event.title}
            />
            <CardContent sx={{
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(212, 234, 247, 0.4)',
                        borderRadius: '10px',
                        padding: '10px',
                    }}>
                <Typography gutterBottom variant="h5" component="div">
                    {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {event.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default EventCard;
