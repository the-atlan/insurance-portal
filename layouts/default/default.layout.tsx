import React from "react";
import styles from "./default.module.css"
import {Flex, Layout} from "antd";
import AppHeader from "@/components/app-header/AppHeader";

const defaultLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout className={styles.layout}>
            <AppHeader />
            {children}
        </Layout>
    )
}

export default defaultLayout;