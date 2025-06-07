import React from "react";
import styles from "./default.module.css"
import {Flex} from "antd";
import AppHeader from "@/components/app-header/AppHeader";

const defaultLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Flex className={styles.layout} vertical component="main">
            <AppHeader />
            {children}
        </Flex>
    )
}

export default defaultLayout;