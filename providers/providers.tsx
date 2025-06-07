"use client";

import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {queryClient} from "@/lib";
import React, {useState} from "react";
import {ThemeContext} from "@/contexts/Theme.context";
import {ConfigProvider, theme} from "antd";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({children}: ProvidersProps) {
    const [currentTheme, setCurrentTheme] = useState('light');

    const toggleTheme = () => {
        setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={{theme: currentTheme, toggleTheme}}>
                <ConfigProvider
                    theme={{
                        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    {children}
                    <ReactQueryDevtools initialIsOpen={false}/>
                </ConfigProvider>
            </ThemeContext.Provider>
        </QueryClientProvider>
    );
} 