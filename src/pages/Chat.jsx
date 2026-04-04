import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Container, Paper, TextField, IconButton,
  CircularProgress, Avatar, Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { logout } from '../services/authService';
import { sendMessage } from '../services/chatService';
import { getUsername } from '../utils/jwtDecoder';
import { useToast } from '../contexts/ToastContext';

function Chat() {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const username = getUsername();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    logout();
    setSessionId(null);
    navigate('/login');
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const result = await sendMessage(trimmed, sessionId);
    setLoading(false);

    if (result.success) {
      setSessionId(result.data.sessionId);
      const apiMessage = {
        role: 'assistant',
        content: result.data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, apiMessage]);
    } else {
      showError(result.error || 'Failed to get a response');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              ChatPDF
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {username && (
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {username}
                </Typography>
              )}
              <Button
                color="inherit"
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderColor: 'rgba(255,255,255,0.6)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Chat Area */}
      <Container
        maxWidth="md"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2, overflow: 'hidden' }}
      >
        {/* Messages List */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 2,
            bgcolor: 'grey.50',
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary" align="center">
                Send a message to start the conversation.
              </Typography>
            </Box>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: isUser ? 'primary.main' : 'secondary.main',
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                  }}
                >
                  {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                </Avatar>

                <Box sx={{ maxWidth: '75%' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: isUser ? 'primary.main' : 'white',
                      color: isUser ? 'white' : 'text.primary',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block', textAlign: isUser ? 'right' : 'left' }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <Paper elevation={1} sx={{ px: 2, py: 1.5, borderRadius: '18px 18px 18px 4px' }}>
                <CircularProgress size={18} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Paper>

        <Divider sx={{ mb: 2 }} />

        {/* Input Area */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 44,
              height: 44,
              flexShrink: 0,
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default Chat;