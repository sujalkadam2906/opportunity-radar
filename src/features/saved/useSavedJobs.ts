import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SavedJobRecord, JobListing } from '../../types';
import { storage } from '../../services/storage/idbStorage';
import { useToast } from '../../components/feedback/useToast';

const SAVED_JOBS_KEY = ['saved_jobs'];

export function useSavedJobs() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const query = useQuery<SavedJobRecord[]>({
    queryKey: SAVED_JOBS_KEY,
    queryFn: async () => {
      return storage.getSavedJobs();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (job: JobListing) => {
      await storage.saveJob(job);
      return job;
    },
    onMutate: async (job) => {
      await queryClient.cancelQueries({ queryKey: SAVED_JOBS_KEY });
      const previous = queryClient.getQueryData<SavedJobRecord[]>(SAVED_JOBS_KEY) || [];
      const newRecord: SavedJobRecord = {
        jobId: job.id,
        savedAt: new Date().toISOString(),
        jobSnapshot: job,
      };
      queryClient.setQueryData<SavedJobRecord[]>(SAVED_JOBS_KEY, [
        newRecord,
        ...previous,
      ]);
      return { previous };
    },
    onError: (_err, job, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SAVED_JOBS_KEY, context.previous);
      }
      error('Failed to save job', `Could not bookmark ${job.title}. Changes reverted.`);
    },
    onSuccess: (job) => {
      success(
        'Job Bookmarked',
        `${job.title} at ${job.company.name} saved to your list.`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_JOBS_KEY });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await storage.unsaveJob(jobId);
      return jobId;
    },
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: SAVED_JOBS_KEY });
      const previous = queryClient.getQueryData<SavedJobRecord[]>(SAVED_JOBS_KEY) || [];
      queryClient.setQueryData<SavedJobRecord[]>(
        SAVED_JOBS_KEY,
        previous.filter((rec) => rec.jobId !== jobId)
      );
      return { previous };
    },
    onError: (_err, _jobId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SAVED_JOBS_KEY, context.previous);
      }
      error('Failed to remove bookmark', 'Storage error encountered. Reverting changes.');
    },
    onSuccess: () => {
      success('Bookmark Removed', 'Listing removed from your saved collection.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_JOBS_KEY });
    },
  });

  const toggleSave = (job: JobListing) => {
    const isCurrentlySaved = (query.data || []).some((r) => r.jobId === job.id);
    if (isCurrentlySaved) {
      unsaveMutation.mutate(job.id);
    } else {
      saveMutation.mutate(job);
    }
  };

  const isSaved = (jobId: string): boolean => {
    return (query.data || []).some((r) => r.jobId === jobId);
  };

  return {
    savedJobs: query.data || [],
    isLoading: query.isLoading,
    toggleSave,
    isSaved,
    isMutating: saveMutation.isPending || unsaveMutation.isPending,
  };
}
