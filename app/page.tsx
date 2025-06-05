'use client';
import React from 'react';
import { Card, Button, Typography, Space, Flex } from 'antd';
import Link from 'next/link';
import styles from './page.module.css';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
      <Flex
          justify="center"
          align="center"
          className={styles.fullHeightContainer}
      >
        <Card className={styles.card}>
          <Title level={1} style={{ textAlign: 'center' }}>
            پرتال هوشمند بیمه
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: '24px' }}>
            برای شروع، یک درخواست جدید ثبت کنید یا لیست درخواست‌های قبلی خود را مشاهده نمایید.
          </Paragraph>

          {/* از Space برای ایجاد فاصله بین دکمه‌ها استفاده می‌کنیم */}
          <Flex justify="center">
            <Space size="large">
              <Link href="/apply" passHref>
                <Button type="primary" size="large">
                  ثبت درخواست جدید
                </Button>
              </Link>
              <Link href="/submissions" passHref>
                <Button size="large">
                  مشاهده درخواست‌ها
                </Button>
              </Link>
            </Space>
          </Flex>
        </Card>
      </Flex>
  );
};

export default HomePage;