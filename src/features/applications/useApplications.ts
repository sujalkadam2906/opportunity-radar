import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobApplicationRecord, ApplicationStatus, JobListing } from '../../types';
import { storage } from '../../services/storage/idbStorage';
import { useToast } from '../../components/feedback/useToast';

const APPLICATIONS_KEY = ['applications'];

export function useApplications() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const query = useQuery<JobApplicationRecord[]>({
    queryKey: APPLICATIONS_KEY,
    queryFn: async () => {
      return storage.getApplications();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (record: JobApplicationRecord) => {
      await storage.saveApplication(record);
      return record;
    },
    onMutate: async (record) => {
      await queryClient.cancelQueries({ queryKey: APPLICATIONS_KEY });
      const previous =
        queryClient.getQueryData<JobApplicationRecord[]>(APPLICATIONS_KEY) || [];
      const index = previous.findIndex((a) => a.id === record.id);
      let updated: JobApplicationRecord[];
      if (index >= 0) {
        updated = [...previous];
        updated[index] = record;
      } else {
        updated = [record, ...previous];
      }
      queryClient.setQueryData<JobApplicationRecord[]>(APPLICATIONS_KEY, updated);
      return { previous };
    },
    onError: (_err, _record, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPLICATIONS_KEY, context.previous);
      }
      error('Tracking Update Failed', 'Failed to update application stage. Reverting.');
    },
    onSuccess: (record) => {
      success(
        'Application Status Updated',
        `Moved "${record.jobTitle}" to ${record.status.toUpperCase()}`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await storage.deleteApplication(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: APPLICATIONS_KEY });
      const previous =
        queryClient.getQueryData<JobApplicationRecord[]>(APPLICATIONS_KEY) || [];
      queryClient.setQueryData<JobApplicationRecord[]>(
        APPLICATIONS_KEY,
        previous.filter((a) => a.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPLICATIONS_KEY, context.previous);
      }
      error('Delete Failed', 'Failed to remove application entry.');
    },
    onSuccess: () => {
      success('Application Removed', 'Record removed from application tracker.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
  });

  const setJobStatus = (
    job: JobListing,
    newStatus: ApplicationStatus,
    customNotes?: string
  ) => {
    const existing = (query.data || []).find((a) => a.id === job.id);
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const record: JobApplicationRecord = {
      id: job.id,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company.name,
      location: job.location,
      status: newStatus,
      appliedDate:
        newStatus === 'applied' && !existing?.appliedDate
          ? today
          : existing?.appliedDate,
      interviewDate: existing?.interviewDate,
      notes: customNotes !== undefined ? customNotes : (existing?.notes || ''),
      updatedAt: now,
      createdAt: existing?.createdAt || now,
    };

    saveMutation.mutate(record);
  };

  const getApplication = (jobId: string): JobApplicationRecord | undefined => {
    return (query.data || []).find((a) => a.jobId === jobId);
  };

  return {
    applications: query.data || [],
    isLoading: query.isLoading,
    saveApplication: saveMutation.mutate,
    deleteApplication: deleteMutation.mutate,
    setJobStatus,
    getApplication,
    isMutating: saveMutation.isPending || deleteMutation.isPending,
  };
}
