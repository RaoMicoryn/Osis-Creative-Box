import type { ThemeConfig } from 'antd';

/** Token sama dengan form Creative Box agar tampilannya satu keluarga. */
export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: '#6a5fc9',
    borderRadius: 14,
    colorBorder: '#dcd9f7',
    colorText: '#2b2a5c',
    fontFamily: 'inherit',
  },
  components: {
    Table: { headerBg: '#f1efff', headerColor: '#2b2a5c', rowHoverBg: '#f8f7ff' },
  },
};
