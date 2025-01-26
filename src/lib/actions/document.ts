'use server';

import { BlockKind } from '@/components/chat/block';
import { createAdminClient } from '@/lib/supabase/admin';

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
  data,
}: {
  id: string;
  title: string;
  kind: BlockKind;
  content: string;
  userId: string;
  data?: any;
}) {
  const supabaseAdmin = createAdminClient();

  const { data: documentSaved, error } = await supabaseAdmin
    .from('doc_model')
    .insert({
      id,
      title,
      kind,
      content,
      user_id: userId,
      data,
    })
    .single();
  if (error) throw error;
  return documentSaved;
}

export async function getDocumentsById(id: string) {
  const supabaseAdmin = createAdminClient();

  const { data: documents, error } = await supabaseAdmin
    .from('doc_model')
    .select('*')
    .eq('id', id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return documents;
}

export async function getDocumentById(id: string) {
  const supabaseAdmin = createAdminClient();

  const { data: document, error } = await supabaseAdmin
    .from('doc_model')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return document;
}

export async function updateRawDocumentById({
  cId,
  itemId,
  docId,
}: {
  cId: string;
  itemId: number;
  docId: string;
}) {
  const supabaseAdmin = createAdminClient();
  const { data: document, error } = await supabaseAdmin.rpc(
    'update_doc_source',
    {
      source_id: parseInt(cId),
      new_item_id: itemId,
      doc_id: docId,
    },
  );
  if (error) throw error;
  return document;
}
