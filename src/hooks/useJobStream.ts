import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  StreamConnectionStatus,
  WebSocketStreamEvent,
} from '../types';
import { jobService } from '../services/jobService';
import { useToast } from '../components/feedback/useToast';

const DEFAULT_WS_URL = 'ws://localhost:4001';
const MAX_RECONNECT_ATTEMPTS = 3;

export function useJobStream() {
  const [status, setStatus] = useState<StreamConnectionStatus>('connecting');
  const [newJobsCount, setNewJobsCount] = useState<number>(0);
  const queryClient = useQueryClient();
  const { info } = useToast();

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef<boolean>(false);

  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;

    const wsUrl = import.meta.env.VITE_WS_URL || DEFAULT_WS_URL;
    setStatus('connecting');

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) return;
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        try {
          const data = JSON.parse(event.data) as WebSocketStreamEvent;
          if (data.type === 'NEW_JOB_OPPORTUNITY') {
            const newJob = data.payload;
            jobService.injectLiveJob(newJob);
            setNewJobsCount((c) => c + 1);

            // Invalidate TanStack query cache so discovery list updates automatically
            queryClient.invalidateQueries({ queryKey: ['jobs'] });

            info(
              'New Opportunity Streamed!',
              `${newJob.title} at ${newJob.company.name}`
            );
          }
        } catch (e) {
          console.warn('[useJobStream] Failed to parse message:', e);
        }
      };

      ws.onclose = () => {
        if (isUnmountedRef.current) return;
        wsRef.current = null;

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          setStatus('connecting');
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        } else {
          // Gracefully fall back to local offline mode
          setStatus('offline_mode');
        }
      };

      ws.onerror = () => {
        if (isUnmountedRef.current) return;
        // On error, let onclose handle reconnection/fallback
      };
    } catch {
      setStatus('offline_mode');
    }
  }, [queryClient, info]);

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    status,
    newJobsCount,
  };
}
