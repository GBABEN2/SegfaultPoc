export class Context {
    // log;
     startTime = new Date();
     trackingId = '123e4567-e89b-12d3-a456-426614174000';
     correlationId;
     ip;
     authAxios;
     _username;
     userDetails;
     authToken;

    constructor(correlationId, ip, healthLogging = false) {
        //Initalise username
        this._username = 'NOT_AUTHENTICATED';
        this.ip = ip;

        //Initialise empty user details as this will be populated later - Atrium only
        this.userDetails = {
            displayName: '',
            role: '',
            symphonyRole: '',
            portalLanguage: '',
            symphonyLanguage: '',
            email: '',
            mirrorUsername: '',
        };

        //Initialise correlationId with provided value if defined or trackingId if undefined
        if (correlationId && correlationId.length > 0) {
            if (typeof correlationId === 'string') {
                this.correlationId = correlationId;
            } else {
                this.correlationId = correlationId[0];
            }
        } else {
            this.correlationId = this.trackingId;
        }

        //Create child log with fixed attributes
        // this.log = logger.child({
        //     trackingId: this.trackingId,
        //     correlationId: this.correlationId,
        //     ip,
        //     level: healthLogging ? healthLoggerConfig.level : undefined,
        // });

        // //Create authentication axios instance
        // this.authAxios = axios.create({
        //     headers: { 'atradius-correlation-id': this.correlationId },
        // });

        // this.authAxios.interceptors.response.use(
        //     (response)=> response,
        //     async (err) => {
        //         err.config.headers = '** REDACTED **';
        //         err.config.httpsAgent = '** REDACTED **';
        //         throw err;
        //     },
        // );
    }

    // addLogAttributes(attributes) {
    //     this.log = this.log.child(attributes);
    // }

    set username(username) {
        this._username = username;

        // Update the context logger with the new username
        // this.log = this.log.child({ username: this._username });
    }

    get username() {
        return this._username;
    }
}
