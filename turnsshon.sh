#!/bin/bash
echo "Turning on ssh-agent"
eval $(ssh-agent)
echo "ssh-agent is now on"
echo "requesting ssh passphrase please provide"
ssh-add
echo "adding ssh passphrase to ssh-agent completed"