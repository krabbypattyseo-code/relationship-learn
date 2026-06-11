import { notFound } from 'next/navigation';
import EntryDetailClient from '@/components/EntryDetailClient';
import { getEntryById } from '@/lib/storage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HaristEntryPage({ params }: PageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry || entry.user_id !== 'harist') {
    notFound();
  }

  return (
    <EntryDetailClient entry={entry} userId="harist" userLabel="Harist" />
  );
}
