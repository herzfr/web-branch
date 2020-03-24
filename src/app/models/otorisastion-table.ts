export interface OtoTable {
    transid: string;
    branchcode: string;
    terminalid: string;
    timestampentry: number;
    timestampprocess: number;
    queuedate: string;
    queuecode: string;
    queueno: number;
    userid: string;
    userterminal: string;
    status: number;
    transcnt: number;
    transeq: number;
    transbuff: string;
    trntype: string;
    isValidated: number;
    isRejected: number;
    timeStampValidation: number;
}