"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apiRequest = function (props) {
    var url = props.url, token = props.token, method = props.method, params = props.params;
    var requestUrl = new URL(url);
    if (method === "GET" && params) {
        requestUrl.search = new URLSearchParams(params).toString();
    }
    return new Promise(function (resolve, reject) {
        fetch(requestUrl, {
            method: method,
            headers: {
                "Content-Type": "application/vnd.api+json",
                Authorization: "Bearer ".concat(token),
                "Access-Control-Request-Headers": "Content-Type, Authorization",
            },
            // referrer: "",
            // mode: "no-cors",
            body: method !== "GET" ? JSON.stringify(params) : undefined,
        })
            .then(function (response) {
            response
                .json()
                .then(function (data) {
                response.ok ? resolve(data) : reject(data);
            })
                .catch(reject);
        })
            .catch(reject);
    });
};
var OutreachBaseURL = "https://api.outreach.io/api/v2";
var OutreachClient = function () {
    var createAccount = function (params, token) {
        var url = "".concat(OutreachBaseURL, "/accounts");
        return apiRequest({
            url: url,
            token: token,
            method: "POST",
            params: {
                data: {
                    type: "account",
                    attributes: __assign({}, params),
                },
            },
        });
    };
    var updateAccountName = function (params, token) {
        var id = params.id, name = params.name;
        var url = "".concat(OutreachBaseURL, "/accounts/").concat(id);
        return apiRequest({
            url: url,
            token: token,
            method: "PATCH",
            params: {
                data: {
                    type: "account",
                    attributes: {
                        name: name,
                    },
                },
            },
        });
    };
    var createProspect = function (params, token) {
        var accountId = params.accountId, attributes = __rest(params, ["accountId"]);
        var url = "".concat(OutreachBaseURL, "/prospects");
        return apiRequest({
            url: url,
            token: token,
            method: "POST",
            params: {
                data: {
                    type: "prospect",
                    attributes: attributes,
                    relationships: {
                        account: {
                            data: {
                                type: "account",
                                id: accountId,
                            },
                        },
                    },
                },
            },
        });
    };
    var updateProspectName = function (params, token) {
        var id = params.id, attributes = __rest(params, ["id"]);
        var url = "".concat(OutreachBaseURL, "/prospects/").concat(id);
        return apiRequest({
            url: url,
            token: token,
            method: "PATCH",
            params: { data: { type: "prospect", id: id, attributes: attributes } },
        });
    };
    var getSequences = function (token) {
        var url = "".concat(OutreachBaseURL, "/sequences");
        return apiRequest({ url: url, token: token, method: "GET" });
    };
    var addProspectToSequence = function (params, token) {
        var prospectId = params.prospectId, sequenceId = params.sequenceId;
        var url = "".concat(OutreachBaseURL, "/sequenceStates");
        return apiRequest({
            url: url,
            token: token,
            method: "POST",
            params: {
                data: {
                    type: "sequenceState",
                    relationships: {
                        prospect: {
                            data: {
                                type: "prospect",
                                id: prospectId,
                            },
                        },
                    },
                    sequence: {
                        data: {
                            type: "sequence",
                            id: sequenceId,
                        },
                    },
                },
            },
        });
    };
    var getMailboxes = function (params, token) {
        var userId = params.userId;
        var url = "".concat(OutreachBaseURL, "/mailboxes?filter[userId]=").concat(userId);
        return apiRequest({ url: url, token: token, method: "GET" });
    };
    var testMailboxSync = function (params, token) {
        var mailboxId = params.mailboxId;
        var url = "".concat(OutreachBaseURL, "/mailboxes/").concat(mailboxId, "/actions/testSync");
        return apiRequest({ url: url, token: token, method: "POST", params: {} });
    };
    return {
        createAccount: createAccount,
        updateAccountName: updateAccountName,
        createProspect: createProspect,
        updateProspectName: updateProspectName,
        getSequences: getSequences,
        addProspectToSequence: addProspectToSequence,
        getMailboxes: getMailboxes,
        testMailboxSync: testMailboxSync,
    };
};
exports.default = OutreachClient;
