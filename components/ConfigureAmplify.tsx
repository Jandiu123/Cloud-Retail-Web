"use client";

import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "us-east-1_yr2zXP8Ac",
            userPoolClientId: "6bcvj6bh1spmnv2m57sqsum331",
        },
    },
});

export default function ConfigureAmplifyClientSide() {
    return null;
}