// src/pages/Messages.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/app/AuthProvider';
import { Navbar } from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FiSearch, FiMessageSquare, FiUser, FiHome, FiPlus } from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
  property_id: string | null;
  sender_profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  recipient_profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  property: {
    id: string;
    title: string;
    photo: string | null;
  } | null;
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            recipient_id,
            content,
            created_at,
            read,
            property_id,
            sender_profile:profiles!sender_id(id, first_name, last_name, avatar_url),
            recipient_profile:profiles!recipient_id(id, first_name, last_name, avatar_url),
            property:homes!property_id(id, title, photo)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time updates
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user?.id}`
        },
        (payload) => {
          fetchMessages(); // Refresh messages on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const filteredMessages = messages.filter(message => {
    const searchLower = searchQuery.toLowerCase();
    const senderName = `${message.sender_profile.first_name} ${message.sender_profile.last_name}`.toLowerCase();
    const recipientName = `${message.recipient_profile.first_name} ${message.recipient_profile.last_name}`.toLowerCase();
    const content = message.content.toLowerCase();
    const propertyTitle = message.property?.title.toLowerCase() || '';

    return (
      senderName.includes(searchLower) ||
      recipientName.includes(searchLower) ||
      content.includes(searchLower) ||
      propertyTitle.includes(searchLower)
    );
  });

  const unreadMessages = filteredMessages.filter(m => !m.read && m.recipient_id === user?.id);
  const sentMessages = filteredMessages.filter(m => m.sender_id === user?.id);
  const receivedMessages = filteredMessages.filter(m => m.recipient_id === user?.id);

  const markAsRead = async (messageId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) throw error;
      
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading messages...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h1 className="text-2xl font-bold mb-6">Messages</h1>
              
              <div className="relative mb-6">
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <Button asChild className="w-full mb-6">
                <Link to="/messages/new">
                  <FiPlus className="mr-2" />
                  New Message
                </Link>
              </Button>
              
              <div className="space-y-1">
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
                >
                  <FiMessageSquare className="text-gray-600" />
                  <span>All Messages</span>
                  {unreadMessages.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {unreadMessages.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="inbox" className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-xs mb-6">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inbox">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {receivedMessages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No messages in your inbox
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {receivedMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            markAsRead(message.id);
                            navigate(`/messages/${message.id}`, {
                              state: {
                                message,
                                recipient: message.sender_profile,
                                property: message.property
                              }
                            });
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={message.sender_profile.avatar_url} />
                              <AvatarFallback>
                                {message.sender_profile.first_name?.[0]}
                                {message.sender_profile.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  {message.sender_profile.first_name} {message.sender_profile.last_name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                                </span>
                              </div>
                              <p className={`text-sm ${!message.read ? 'font-medium' : 'text-gray-600'}`}>
                                {message.content}
                              </p>
                              {message.property && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                  <FiHome className="text-gray-400" />
                                  <span>{message.property.title}</span>
                                </div>
                              )}
                            </div>
                            {!message.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sent">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {sentMessages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No sent messages
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {sentMessages.map((message) => (
                        <div
                          key={message.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/messages/${message.id}`, {
                            state: {
                              message,
                              recipient: message.recipient_profile,
                              property: message.property
                            }
                          })}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={message.recipient_profile.avatar_url} />
                              <AvatarFallback>
                                {message.recipient_profile.first_name?.[0]}
                                {message.recipient_profile.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  {message.recipient_profile.first_name} {message.recipient_profile.last_name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {message.content}
                              </p>
                              {message.property && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                  <FiHome className="text-gray-400" />
                                  <span>{message.property.title}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}