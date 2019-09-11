import { XrmFakedContext } from '../../src/XrmFakedContext';
import { IXrmFakedContext } from '../../src/IXrmFakedContext';
import { Entity } from '../../src/Entity';

var Guid = require("guid");

var fakeUrl: string = 'http://fakeUrl';

describe("XrmFakedContext: Create", function () {
    let context: IXrmFakedContext = null;
    let fakeXhr: any = null;
    beforeEach(() => {
        context = new XrmFakedContext("v9.0",fakeUrl, true);
    });
    
    test("should return entity via helper method", done => {
        var contactId = Guid.create();
        var entity = new Entity("contact", contactId, {firstname: "Leo"});
        context.initialize([
            entity
        ]);
        var contact = context.getEntity("contact", contactId.toString());
        expect(contact.attributes.firstname).toBe("Leo");
        done();
    });

    test("should add entity to the context", done => {
        var entity = new Entity("contact", null, {firstname: "Leo"});
        var id = context.addEntity(entity);
        var addedContact = context.getEntity("contact", id);
        expect(addedContact.attributes.firstname).toBe("Leo");
        done();
    });

    test("should remove entity from the context", done => {
        var contactId = Guid.create();
        var id = contactId.toString();
        var entity = new Entity("contact", contactId, {firstname: "Leo"});
        context.initialize([
            entity
        ]);
        context.removeEntity("contact", id);
        var contact = context.createQuery("contact").firstOrDefault();
        expect(contact).toBeUndefined();
        done();
    });

    test("should update entity in the context", done => {
        var contactId = Guid.create();
        var id = contactId.toString();
        var entity = new Entity("contact", contactId, {firstname: "Leo"});
        context.initialize([
            entity
        ]);

        var updatedEntity = new Entity("contact", contactId, {firstname: "Lionel"});
        context.updateEntity(updatedEntity);

        var contact = context.createQuery("contact").firstOrDefault();
        expect(contact.attributes.firstname).toBe("Lionel");
        done();
    });

    test("should keep previous attributes when updating an entity in the context", done => {
        var contactId = Guid.create();
        var id = contactId.toString();
        var entity = new Entity("contact", contactId, {firstname: "Leo", lastname: "Messi"});
        context.initialize([
            entity
        ]);

        var updatedEntity = new Entity("contact", contactId, {firstname: "Lionel"});
        context.updateEntity(updatedEntity);
        
        var contact = context.createQuery("contact").firstOrDefault();
        expect(contact.attributes.firstname).toBe("Lionel");
        expect(contact.attributes.lastname).toBe("Messi");
        done();
    });

    test("should remove previous attributes when replacing an entity in the context", done => {
        var contactId = Guid.create();
        var id = contactId.toString();
        var entity = new Entity("contact", contactId, {firstname: "Leo", lastname: "Messi"});
        context.initialize([
            entity
        ]);

        var entityToReplace = new Entity("contact", contactId, {firstname: "Lionel"});
        context.replaceEntity(entityToReplace);
        
        var contact = context.createQuery("contact").firstOrDefault();
        expect(contact.attributes.firstname).toBe("Lionel");
        expect(contact.attributes.lastname).toBeUndefined();
        done();
    });
});