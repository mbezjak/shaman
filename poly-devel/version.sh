#!/bin/bash
#

awk -F= '/^shaman\.version =/{print $2}' shaman.js | tr -d " ';"
