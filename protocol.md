# `logaddress` UDP protocol
Offset | Length  | Data    | Type     |Description           | Example
-------|:-------:|---------|:--------:|----------------------|--------------
0      | 4       | Header  | `uint32` | Always `0xFFFFFFFF`. | `0xFFFFFFFF`
4      | 1       | Type    | `uint8`  | Can be `0x52` (default) or `0x53` (with secret). | `0x52`
5      | Varying | Secret  | `string` | A string of variable length, only present when type is `0x53`. | `1Hello`
5+     | Varying | Message | `string` | If type is `0x52`, this is just plain text. If type is `0x53`, offset changes to `5 + secret length in bytes`. Message is terminated with a newline and null terminator (`0a00`). | `Cats are great\n\x00`

*Please note that is it currently unclear as to whether type `0x53` requires a message starting with a number greater than 0, but the convar `sv_logsecret` enforces it.* 
