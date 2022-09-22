# SegfaultPoc

On a machine with Docker installed, check out this project. 

Within the root directory run 'docker-compose build'

Edit the docker-compose.yml file, and fill in the environment variables for DB connection URL, user, password

Run 'docker-compose up'

This should get the container running, and when it tries to create the connection pool throws the following segfault error:

{ poolAlias: 'segfault_prototype' } Creating connection pool
my-service_1  | PID 15 received SIGSEGV for address: 0x0
my-service_1  | /home/node/app/node_modules/segfault-handler/build/Release/segfault-handler.node(+0x2f56)[0x7fd50c046f56]
my-service_1  | /lib64/libpthread.so.0(+0x12ce0)[0x7fd5116e7ce0]
my-service_1  | /lib64/libc.so.6(+0xcce67)[0x7fd5113dce67]
my-service_1  | /lib64/libc.so.6(_IO_vfprintf+0x7d0)[0x7fd511377300]
my-service_1  | /lib64/libc.so.6(vsnprintf+0x94)[0x7fd5113a02d4]
my-service_1  | /lib64/libc.so.6(__snprintf+0x93)[0x7fd51137fb13]
my-service_1  | /usr/lib/oracle/19.16/client64/lib/libclntsh.so(+0x141a01a)[0x7fd2752ff01a]
my-service_1  | /usr/lib/oracle/19.16/client64/lib/libclntsh.so(kpuEntryCallbackTLS+0x1b4)[0x7fd2753c5994]
my-service_1  | /usr/lib/oracle/19.16/client64/lib/libclntsh.so(kpuspcreate+0x3fb)[0x7fd27546430b]
my-service_1  | /usr/lib/oracle/19.16/client64/lib/libclntsh.so(OCISessionPoolCreate+0x145)[0x7fd2751a05d5]
my-service_1  | /home/node/app/node_modules/oracledb/build/Release/oracledb-5.4.0-linux-x64.node(dpiOci__sessionPoolCreate+0x89)[0x7fd50c296b39]
my-service_1  | /home/node/app/node_modules/oracledb/build/Release/oracledb-5.4.0-linux-x64.node(dpiPool_create+0x5c1)[0x7fd50c29ba41]
my-service_1  | /home/node/app/node_modules/oracledb/build/Release/oracledb-5.4.0-linux-x64.node(+0x273eb)[0x7fd50c2703eb]
my-service_1  | /home/node/app/node_modules/oracledb/build/Release/oracledb-5.4.0-linux-x64.node(+0x19c25)[0x7fd50c262c25]
my-service_1  | node(+0x1146dc4)[0xe1e6f55dc4]
my-service_1  | /lib64/libpthread.so.0(+0x81cf)[0x7fd5116dd1cf]
my-service_1  | /lib64/libc.so.6(clone+0x43)[0x7fd511349dd3]


We are only seeing the error in this project when setting the EVENT_10842 environment variable to 15, if you set it to 11 and below we do not get the issue creating the connection pool.

A sample package spec and body has been provided in the DB folder which can be run into the DB you are connecting to. Currently it won't get to the point where it will execute this package when the EVENT_10842 variable is set to 15