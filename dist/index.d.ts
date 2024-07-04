export type OutreachResponseItem<T extends string> = {
    type: T;
    id: number;
    attributes: {
        [key: string]: any;
    };
    relationships: {
        [key: string]: any;
    };
    [key: string]: any;
};
export type OutreachResponseResult<T> = {
    data: T;
    [key: string]: any;
};
declare const OutreachClient: (props: {
    handleBaseURL?: (baseURL: string) => string;
}) => {
    getAccountById: (id: number, token: string) => Promise<{
        data: OutreachResponseItem<"account">;
    }>;
    createAccount: (params: Partial<{
        name: string;
        domain: string;
        ownerId: number;
    }>, token: string) => Promise<{
        data: OutreachResponseItem<"account">;
    }>;
    updateAccountName: (params: {
        id: number;
        name: string;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"account">;
    }>;
    getProspectById: (id: number, token: string) => Promise<{
        data: OutreachResponseItem<"prospect">;
    }>;
    getProspectByEmail: (email: string, token: string) => Promise<{
        data: OutreachResponseItem<"prospect">[];
    }>;
    createProspect: (params: {
        emails: string[];
        firstName: string;
        middleName: string;
        lastName: string;
        title: string;
        accountId: number;
        ownerId: number;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"prospect">;
    }>;
    updateProspect: (params: {
        id: number;
        [key: string]: any;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"prospect">;
    }>;
    getSequences: (params: {
        [key: string]: string;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"sequence">[];
    }>;
    getSequenceById: (id: number, token: string) => Promise<OutreachResponseItem<"sequenceState">>;
    addProspectToSequence: (params: {
        prospectId: number;
        sequenceId: number;
        mailboxId: number;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"sequenceState">;
    }>;
    getMailboxes: (params: {
        userId: number | string;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"mailbox">[];
    }>;
    testMailboxSync: (params: {
        mailboxId: number | string;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"mailbox">;
    }>;
    getSequenceState: (id: number, params: {
        [key: string]: string;
    }, token: string) => Promise<OutreachResponseResult<OutreachResponseItem<"sequenceState">>>;
    getMailings: (params: {
        [key: string]: string;
    }, token: string) => Promise<OutreachResponseResult<OutreachResponseItem<"mailing">[]>>;
};
export default OutreachClient;
