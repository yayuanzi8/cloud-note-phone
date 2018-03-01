export class Auth {
    expDuration?;
    loginDate?;
    token?;
    user?;
    pass = false;
    errorMsg?;
};

export class Note {
    nid?:string;
    title?:string;
    content?:string;
    parent?:string;
    createTime?;
    type?:string;
}

export class Directory {
    did?:string;
    dirName?:string;
    parent?:string;
    createTime?;
    type?:string;
}

export class Share{
    nid?: string;
    title?: string;
    shareDate?: number;
    sid?: string;
    content?: string;
    username?: string;
}