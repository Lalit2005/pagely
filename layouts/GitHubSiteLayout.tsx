import { useRouter } from 'next/router';
import { ghSites } from '@prisma/client';
import Link from 'next/link';
import { BiCode } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useClerkSWR } from '@/lib/fetcher';
import ProfileDropdown from '@/components/popovers/ProfileDropdown';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { GoInbox } from 'react-icons/go';

const SidebarLayout: React.FC<{
  activeTab: 'code' | 'setup' | 'settings';
  title?: string;
}> = ({ activeTab, title, ...props }) => {
  const { emailAddresses, profileImageUrl, fullName, firstName } = useUser();
  const { signOut } = useClerk();

  const router = useRouter();
  const { data } = useClerkSWR<ghSites>(
    `/api/getSiteData/github/?siteId=${router.query.siteId}`
  );
  return (
    <div>
      <div className='block lg:hidden'>
        <DashboardNav />
        <Head>
          <title>
            {title ||
              data?.siteName +
                ' - ' +
                activeTab.charAt(0).toUpperCase() +
                activeTab.slice(1) +
                ' | ' +
                'Pagely'}
          </title>
        </Head>
      </div>
      <div className='lg:flex'>
        {/* <div className='sticky top-0 overflow-y-hidden'> */}
        <div
          style={{ position: 'sticky' }}
          className='absolute top-0 h-screen left-0 px-10 py-5 bg-gray-50 w-[20vw] border-r hidden flex-col justify-between lg:flex'>
          <div>
            <Link href='/dashboard'>
              <a>
                <small className='text-gray-700 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700'>
                  {' '}
                  {'<'}- Go back
                </small>
              </a>
            </Link>
            <ul className='mt-10'>
              <li
                className={`my-2 rounded ${
                  activeTab === 'setup' ? ' bg-gray-200' : ' hover:bg-gray-300'
                }`}>
                <Link href={`/github-site/${data?.id}`}>
                  <a className='block px-3 py-2 my-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700'>
                    {' '}
                    <GoInbox className='relative inline-block bottom-[2px]' />{' '}
                    Setup
                  </a>
                </Link>
              </li>
              <li
                className={`my-2 rounded ${
                  activeTab === 'code' ? ' bg-gray-200' : ' hover:bg-gray-300'
                }`}>
                <Link href={`/github-site/${data?.id}/code`}>
                  <a className='block px-3 py-2 my-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700'>
                    {' '}
                    <BiCode className='relative inline-block bottom-[2px]' />{' '}
                    Code injection
                  </a>
                </Link>
              </li>
              <li
                className={`my-2 rounded ${
                  activeTab === 'settings'
                    ? ' bg-gray-200'
                    : ' hover:bg-gray-300'
                }`}>
                <Link href={`/github-site/${data?.id}/settings`}>
                  <a className='block px-3 py-2 my-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700'>
                    {' '}
                    <FiSettings className='relative inline-block bottom-[2px]' />{' '}
                    Settings
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <ProfileDropdown
            emailAddresses={emailAddresses}
            profileImageUrl={profileImageUrl}
            fullName={fullName}
            firstName={firstName}
            signOut={signOut}
          />
        </div>
        <div className='mx-10 mt-20'>{props.children}</div>
      </div>
      <Toaster />
    </div>
  );
};

export default SidebarLayout;
