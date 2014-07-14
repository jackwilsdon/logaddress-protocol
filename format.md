# `logremote` format
Offset | Data | Type | Description | Example
-------|------|------|------------ |--------
0 | Header | Long | Always `0xFFFFFFFF`. | `0xFFFFFFFF`
4 | Type | Byte | Can be `0x52` (default) or `0x53` (with secret). | `0x52`
5 | Secret | String | A string of variable length, only present when type is `0x53`. | `Hello`
5+ | Message | String | If type is `0x52`, this is just plain text. If type is `0x53`, offset changes to `5 + secret length`. Message is terminated with a newline and null terminator (`0a00`). | `Cats are great\n\x00`

*Please note that is it currently unclear as to whether type `0x53` requires a prefix of `1`, but the convar `sv_logsecret` enforces it.* 
