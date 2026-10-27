import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '../../../../lib/auth';
import { getStoreSettings } from '../../../../lib/data';
import StoreSettingsForm from '../../../../components/admin/StoreSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const settings = await getStoreSettings();

  return (
    <StoreSettingsForm initialSettings={settings} />
  );
}
