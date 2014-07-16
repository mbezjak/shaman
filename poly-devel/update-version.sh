#!/bin/bash
#

declare -r new="$1"

properties-set shaman.js shaman.version "'$new';"
