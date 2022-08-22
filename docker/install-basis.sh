#!/bin/bash
curl -sL https://aka.ms/BasisCliInstall | bash
source ~/.bashrc
basis tunnel delete bill-test2
basis host -n bill-test2 &
