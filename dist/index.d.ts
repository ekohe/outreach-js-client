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
declare const OutreachClient: () => {
    createAccount: (params: Partial<{
        name: string;
        domain: string;
    }>, token: string) => Promise<{
        data: OutreachResponseItem<"account">;
    }>;
    updateAccountName: (params: {
        id: number;
        name: string;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"account">;
    }>;
    createProspect: (params: {
        emails: string[];
        firstName: string;
        middleName: string;
        lastName: string;
        title: string;
        accountId: number;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"prospect">;
    }>;
    updateProspectName: (params: {
        id: number;
        firstName: string;
        middleName: string;
        lastName: string;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"prospect">;
    }>;
    getSequences: (token: string) => Promise<{
        data: OutreachResponseItem<"sequence">[];
    }>;
    addProspectToSequence: (params: {
        prospectId: number;
        sequenceId: number;
    }, token: string) => Promise<{
        data: OutreachResponseItem<"sequenceState">;
    }>;
    getMailboxes: (params: {
        userId: number;
    }, token: string) => Promise<{
        data: OutreachResponseItem<string>[];
    }>;
    testMailboxSync: (params: {
        mailboxId: number;
    }, token: string) => Promise<{
        data: OutreachResponseItem<string>;
    }>;
};
export default OutreachClient;
