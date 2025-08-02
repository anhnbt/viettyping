'use client';

import React, { useState } from 'react';
import { subjects } from '@/data/subjects';
import SplashScreen from '@/components/SplashScreen';
import SubjectSelector from '@/components/SubjectSelector';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  if (showSplash) {
    return (
      <Layout showNavigation={false}>
        <SplashScreen onStart={() => setShowSplash(false)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <SubjectSelector
        subjects={subjects}
        onSelectSubject={(subject) => {
          router.push(`/subjects/${subject.id}`);
        }}
      />
    </Layout>
  );
}
