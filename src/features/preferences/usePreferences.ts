import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPreferences } from '../../types';
import { storage } from '../../services/storage/idbStorage';
import { DEMO_PREFERENCES } from '../../data/demoJobs';
import { useToast } from '../../components/feedback/useToast';

const PREFS_QUERY_KEY = ['user_preferences'];

export function usePreferences() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const query = useQuery<UserPreferences>({
    queryKey: PREFS_QUERY_KEY,
    queryFn: async () => {
      const prefs = await storage.getUserPreferences();
      return prefs || DEMO_PREFERENCES;
    },
    staleTime: Infinity, // Preferences are locally persisted and mutated via hook
  });

  const mutation = useMutation({
    mutationFn: async (updated: UserPreferences) => {
      await storage.saveUserPreferences(updated);
      return updated;
    },
    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({ queryKey: PREFS_QUERY_KEY });
      const previous = queryClient.getQueryData<UserPreferences>(PREFS_QUERY_KEY);
      queryClient.setQueryData(PREFS_QUERY_KEY, newPrefs);
      return { previous };
    },
    onError: (_err, _newPrefs, context) => {
      if (context?.previous) {
        queryClient.setQueryData(PREFS_QUERY_KEY, context.previous);
      }
      error('Failed to update preferences', 'Storage operation encountered an error.');
    },
    onSuccess: () => {
      success('Preferences Saved', 'Match scores have been recalculated.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PREFS_QUERY_KEY });
      // Invalidate jobs fit score calculations
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return {
    preferences: query.data || DEMO_PREFERENCES,
    isLoading: query.isLoading,
    savePreferences: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
