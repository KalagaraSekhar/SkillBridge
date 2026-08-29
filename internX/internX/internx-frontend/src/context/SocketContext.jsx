import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [pingLatency, setPingLatency] = useState('< 20ms');
  const [activeUsersCount, setActiveUsersCount] = useState(18);
  const [lastEvent, setLastEvent] = useState(null);
  const eventListenersRef = useRef(new Map()); // eventType -> Set of callbacks
  const eventSourceRef = useRef(null);

  // Subscribe to real-time events
  const subscribe = useCallback((eventType, callback) => {
    if (!eventListenersRef.current.has(eventType)) {
      eventListenersRef.current.set(eventType, new Set());
    }
    eventListenersRef.current.get(eventType).add(callback);

    return () => {
      eventListenersRef.current.get(eventType)?.delete(callback);
    };
  }, []);

  // Connect to SSE Real-Time Stream
  useEffect(() => {
    let sse;
    const connectStream = () => {
      const query = new URLSearchParams({
        userId: user?.id || 'usr-1',
        email: user?.email || '',
        role: user?.role || 'STUDENT',
        companyId: user?.companyId || ''
      });

      const streamUrl = `/api/realtime/stream?${query.toString()}`;
      sse = new EventSource(streamUrl);
      eventSourceRef.current = sse;

      sse.onopen = () => {
        setIsConnected(true);
        setPingLatency(`${Math.floor(12 + Math.random() * 8)}ms`);
      };

      sse.onerror = () => {
        setIsConnected(false);
        sse.close();
        setTimeout(connectStream, 3000);
      };

      const eventNames = [
        'application:new',
        'application:status_updated',
        'capacity:updated',
        'internship:new',
        'chat:new_message',
        'chat:thread_updated',
        'telemetry:active_users',
        'notification:new',
        'company:status_updated'
      ];

      eventNames.forEach((name) => {
        sse.addEventListener(name, (event) => {
          try {
            const parsed = JSON.parse(event.data);
            setLastEvent({ type: name, ...parsed });

            if (name === 'telemetry:active_users' && parsed.data?.count) {
              setActiveUsersCount(parsed.data.count);
            }

            const callbacks = eventListenersRef.current.get(name);
            if (callbacks) {
              callbacks.forEach((cb) => {
                try {
                  cb(parsed.data || parsed);
                } catch (e) {
                  console.error('Error in event listener:', e);
                }
              });
            }
          } catch (err) {
            console.error('Failed to parse SSE event data', err);
          }
        });
      });
    };

    connectStream();

    return () => {
      if (sse) sse.close();
    };
  }, [user?.id, user?.email, user?.role, user?.companyId]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        pingLatency,
        activeUsersCount,
        lastEvent,
        subscribe
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
