type Channels = {
    id: string;
    title: string;
    image: string;
    source: string;
    category: string;
    number: string;
};

type CategoriesGroups = {
    id: string;
    title: string;
    channels: Channels[];
};

type AccountData = {
    username: string;
    status: boolean;
    isTrial: boolean;
    maxConnections: number;
    expDate: Date | null;
    createDate: Date;
};
type AccountRequest = {
    user_info: {
        username: string;
        password: string;
        message: string;
        auth: 0 | 1,
        status: 'Active' | 'Expired';
        exp_date: string | null;
        is_trial: '0' | '1';
        active_cons: string;
        created_at: string;
        max_connections: string;
        allowed_output_formats: string[];
    },
    server_info: {
        url: string;
        port: string;
        https_port: string;
        server_protocol: string;
        rtmp_port: string;
        timezone: string;
        timestamp_now: number;
        time_now: string;
    }
};

export type {
    Channels,
    CategoriesGroups,
    AccountData,
    AccountRequest
};