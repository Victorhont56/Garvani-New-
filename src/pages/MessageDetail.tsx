// src/pages/MessageDetail.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/AuthProvider';
import { Navbar } from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';

export default function MessageDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(state?.message || null);
  const [recipient, setRecipient] = useState(state?.recipient || null);
  const [property, setProperty] = useState(state?.property || null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(!state?.message);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchMessage = async () => {
        try {
          setLoading(true);
          
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              sender_profile:profiles!sender_id(*),
              recipient_profile:profiles!recipient_id(*),
              property:homes!property_id(*)
            `)
            .eq('id', id)
            .single();

          if (error) throw error;
          
          setMessage(data);
          setRecipient(
            data.sender_id === user?.id ? data.recipient_profile : data.sender_profile
          );
          setProperty(data.property);
          
          // Fetch conversation history
          const { data: convData } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${data.sender_id},recipient_id.eq.${data.recipient_id}),and(sender_id.eq.${data.recipient_id},recipient_id.eq.${data.sender_id})`)
            .order('created_at', { ascending: true });
            
          setConversation(convData || []);
        } catch (error) {
          console.error('Error fetching message:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessage();
    } else if (state?.recipient) {
      setRecipient(state.recipient);
      setProperty(state.property);
    }
  }, [id, user?.id, state]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !recipient?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipient.id,
          content: newMessage,
          property_id: property?.id || null,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      
      setNewMessage('');
      setConversation([...conversation, data]);
      
      // If this is a new conversation, navigate to the message detail
      if (id === 'new') {
        navigate(`/messages/${data.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
              <FiArrowLeft />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={recipient?.avatar_url} />
                <AvatarFallback>
                  {recipient?.first_name?.[0]}
                  {recipient?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">
                  {recipient?.first_name} {recipient?.last_name}
                </h2>
                {property && (
                  <p className="text-sm text-gray-500">
                    Re: {property.title}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Conversation */}
          <div className="p-4 h-[60vh] overflow-y-auto">
            {conversation.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender_id === user?.id ? 'bg-primary text-white' : 'bg-gray-100'}`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-white/70' : 'text-gray-500'}`}>
                        {format(new Date(msg.created_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="resize-none"
              />
              <Button onClick={sendMessage} className="h-full">
                <FiSend />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}