'use client'

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import('./components/Home'), { ssr: false })

export default HomePage
