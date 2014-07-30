var Joi = require('joi');
var schemas = {};
var swaggerVersion = Joi.string().valid('1.2').required().description('Specifies the Swagger Specification version being used. It can be used by the Swagger UI and other clients to interpret the API listing. The value MUST be an existing Swagger specification version.');

schemas.APIReference = Joi.object({
    path: Joi.string().required().description('A relative path to the API declaration from the path used to retrieve this Resource Listing. This path does not necessarily have to correspond to the URL which actually serves this resource in the API but rather where the resource listing itself is served. The value SHOULD be in a relative (URL) path format.'),
    description: Joi.string().optional().description('A short description of the resource.')
}).options({
    className: 'APIReference'
});

schemas.Info = Joi.object({
    title: Joi.string().required().description('The title of the application.'),
    description: Joi.string().required().description('A short description of the application.'),
    termsOfServiceUrl: Joi.string().optional().description('A URL to the Terms of Service of the API.'),
    contact: Joi.string().optional().description('An email to be used for API-related correspondence.'),
    license: Joi.string().optional().description('The license name used for the API.'),
    licenseUrl: Joi.string().optional().description('A URL to the license used for the API.')
}).options({
    className: 'Info'
});

schemas.ResourceListing = Joi.object({
    swaggerVersion: swaggerVersion,
    apiVersion: Joi.string().optional().description('Provides the version of the application API (not to be confused by the specification version).'),
    basePath: Joi.string().optional().description('The root URL serving the API. This field is important because while it is common to have the Resource Listing and API Declarations on the server providing the APIs themselves, it is not a requirement. The API specifications can be served using static files and not generated by the API server itself, so the URL for serving the API cannot always be derived from the URL serving the API specification. The value SHOULD be in the format of a URL.'),
    apis: Joi.array().includes(schemas.APIReference).required().description('Lists the resources to be described by this specification implementation. The array can have 0 or more elements.'),
    info: schemas.Info.description('Provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in the Swagger-UI for convenience.'),
    authorizations: Joi.any().description('Provides information about the authorization schemes allowed on this API.')
}).options({
    className: 'ResourceListing'
});



schemas.Items = Joi.object({
    type: Joi.string().optional(),
    $ref: Joi.string().optional()
}).options({
    className: 'Items'
});


var produces = Joi.array().includes(Joi.string()).optional();
var consumes = Joi.array().includes(Joi.string()).optional();

schemas.Parameter = Joi.object({
    paramType: Joi.string().valid(['path', 'query', 'body', 'header', 'form']).required().description('The type of the parameter (that is, the location of the parameter in the request). The value MUST be one of these values: "path", "query", "body", "header", "form". Note that the values MUST be lower case.'),
    name: Joi.string().required().description('The unique name for the parameter. Each name MUST be unique, even if they are associated with different paramType values. Parameter names are case sensitive.'),
    type: Joi.string().required().description('Type of the parameter'),
    format: Joi.string().optional().description('XXX'),
    minimum: Joi.string().optional().description('XXX'),
    maximum: Joi.string().optional().description('XXX'),
    items: schemas.Items.optional(),
    defaultValue: Joi.string().optional().description('XXX'),
    enum: Joi.array().includes(Joi.string().allow('')).optional().description('XXX'),
    description: Joi.string().optional().description('A brief description of this parameter.'),
    required: Joi.boolean().optional().description('A flag to note whether this parameter is required. If this field is not included, it is equivalent to adding this field with the value false. If paramType is "path" then this field MUST be included and have the value true.'),
    allowMultiple: Joi.boolean().optional().description('Another way to allow multiple values for a "query" parameter. If used, the query parameter may accept comma-separated values. The field may be used only if paramType is "query", "header" or "path".')
}).options({
    className: 'Parameter'
});

schemas.ResponseMessage = Joi.object({
    code: Joi.number().required().description('The HTTP status code returned. The value SHOULD be one of the status codes as described in RFC 2616 - Section 10.'),
    message: Joi.string().required().description('The explanation for the status code. It SHOULD be the reason an error is received if an error status code is used.'),
    responseModel: Joi.string().optional().description('The return type for the given response.')
}).options({
    className: 'ResponseMessage'
});


schemas.Operation = Joi.object({
    method: Joi.string().valid(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']).required().description('The HTTP method required to invoke this operation. The value MUST be one of the following values: "GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS". The values MUST be in uppercase.'),
    summary: Joi.string().optional().description('A short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.'),
    notes: Joi.string().allow('').optional().description('A verbose explanation of the operation behavior.'),
    nickname: Joi.string().required().description('A unique id for the operation that can be used by tools reading the output for further and easier manipulation. For example, Swagger-Codegen will use the nickname as the method name of the operation in the client it generates. The value MUST be alphanumeric and may include underscores. Whitespace characters are not allowed.'),
    authorizations: Joi.any().description('Provides information about the authorization schemes allowed on this API.'),
    type: Joi.string().required(),
    items: schemas.Items.optional(),
    parameters: Joi.array().includes(schemas.Parameter).optional().description('The inputs to the operation. If no parameters are needed, an empty array MUST be included.'),
    responseMessages: Joi.array().includes(schemas.ResponseMessage).optional().description('The inputs to the operation. If no parameters are needed, an empty array MUST be included.'),
    produces: produces.description('A list of MIME types this operation can produce. This is overrides the global produces definition at the root of the API Declaration. Each string value SHOULD represent a MIME type.'),
    consumes: consumes.description('A list of MIME types this operation can consume. This is overrides the global consumes definition at the root of the API Declaration. Each string value SHOULD represent a MIME type.'),
    deprecated: Joi.boolean().optional().description('Declares this operation to be deprecated. Usage of the declared operation should be refrained. Valid value MUST be either "true" or "false".')
}).options({
    className: 'Operation'
});

schemas.API = Joi.object({
    path: Joi.string().required().description('The relative path to the operation, from the basePath, which this operation describes. The value SHOULD be in a relative (URL) path format.'),
    description: Joi.string().optional().description('A short description of the resource.'),
    operations: Joi.array().includes(schemas.Operation).description('A list of the API operations available on this path. The array may include 0 or more operations. There MUST NOT be more than one Operation Object per method in the array.')
}).options({
    className: 'API'
});

schemas.Property = Joi.object({
    type: Joi.string().optional().description('Type of the property'),
    format: Joi.string().optional().description('XXX'),
    minimum: Joi.string().optional().description('XXX'),
    maximum: Joi.string().optional().description('XXX'),
    required: Joi.boolean().optional().description('Invalid field! Remove it!'), // TODO: remove!
    defaultValue: Joi.string().optional().description('XXX'),
    enum: Joi.array().includes(Joi.string()).optional().description('XXX'),
    $ref: Joi.string().optional(),
    items: schemas.Items.optional(),
    description: Joi.string().optional().description('A brief description of this parameter.')
});

schemas.Properties = Joi.object({}).pattern(/.*/, schemas.Property).options({ className: 'Properties' });

schemas.Model = Joi.object({
    type: Joi.string().optional().description('Type of the property'), // TODO: remove!
    id: Joi.string().required().description('A unique identifier for the model. This MUST be the name given to {Model Name}.'),
    description: Joi.string().optional().description('A brief description of this model.'),
    required: Joi.array().includes(Joi.string()).optional().description('A definition of which properties MUST exist when a model instance is produced. The values MUST be the {Property Name} of one of the properties.'),
    properties: schemas.Properties,
    subTypes: Joi.array().includes(Joi.string()).optional().description('List of the model ids that inherit from this model. Sub models inherit all the properties of the parent model. Since inheritance is transitive, if the parent of a model inherits from another model, its sub-model will include all properties. As such, if you have Foo->Bar->Baz, then Baz will inherit the properties of Bar and Foo. There MUST NOT be a cyclic definition of inheritance. For example, if Foo -> ... -> Bar, having Bar -> ... -> Foo is not allowed. There also MUST NOT be a case of multiple inheritance. For example, Foo -> Baz <- Bar is not allowed. A sub-model definition MUST NOT override the properties of any of its ancestors. All sub-models MUST be defined in the same API Declaration.'),
    discriminator: Joi.string().optional().description('MUST be included only if subTypes is included. This field allows for polymorphism within the described inherited models. This field MAY be included at any base model but MUST NOT be included in a sub-model. The value of this field MUST be a name of one of the properties in this model, and that field MUST be in the required list. When used, the value of the discriminator property MUST be the name of the parent model or any of its sub-models (to any depth of inheritance).')
}).options({
    className: 'Model'
});

schemas.Models = Joi.object({}).pattern(/.*/, schemas.Model).options({ className: 'Models' });

schemas.APIDeclaration = Joi.object({
    swaggerVersion: swaggerVersion,
    apiVersion: Joi.string().optional().description('Provides the version of the application API (not to be confused by the specification version).'),
    basePath: Joi.string().optional().description('The root URL serving the API. This field is important because while it is common to have the Resource Listing and API Declarations on the server providing the APIs themselves, it is not a requirement. The API specifications can be served using static files and not generated by the API server itself, so the URL for serving the API cannot always be derived from the URL serving the API specification. The value SHOULD be in the format of a URL.'),
    resourcePath: Joi.string().optional().description('The relative path to the resource, from the basePath, which this API Specification describes. The value MUST precede with a forward slash ("/").'),
    apis: Joi.array().includes(schemas.API).required().description('A list of the APIs exposed on this resource. There MUST NOT be more than one API Object per path in the array.'),
    models: schemas.Models,
    produces: produces.description('A list of MIME types the APIs on this resource can produce. This is global to all APIs but can be overridden on specific API calls.'),
    consumes: consumes.description('A list of MIME types the APIs on this resource can consume. This is global to all APIs but can be overridden on specific API calls.'),
    authorizations: Joi.any().description('Provides information about the authorization schemes allowed on this API.')
}).options({
    className: 'APIDeclaration'
});

module.exports = schemas;