#!/bin/bash
#

declare -r new="$1"
declare -r rev=$(regex-version)

sed -i "s|^shaman\.version = $rev;|shaman.version = '$new';|" shaman.js
