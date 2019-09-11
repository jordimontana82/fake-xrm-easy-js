import { IEntity } from './IEntity';
import IFakeXmlHttpRequest from './IFakeXmlHttpRequest';
import IFakeMessageExecutor from './IFakeMessageExecutor';

export interface IXrmFakedContext {

    /** 
     * @param entities an array of entities that will be used to initialize the context's initial state
    **/
    initialize(entities: Array<IEntity>): void;
    addFakeMessageExecutor(executor: IFakeMessageExecutor): void;
    
    /** 
     * @param logicalName the logicalName of the entity to be retrieved
     * @param id the id of the entity to retrieve
    **/
    getEntity(logicalName: string, id: string): IEntity;

    /** 
     * @param entity the entity to be added to the context
     * @returns the id of the entity that was added to the context, or a new generated id if null
    **/
    addEntity(entity: IEntity): string;

    /** 
     * @param logicalName the logicalName of the entity to be removed from the context
     * @param id the id of the entity to remove
    **/
    removeEntity(logicalName: string, id: string): void;

    /** 
     * @param entity the entity to update, must have a valid logicalName and id must exist
    **/
    updateEntity(entity: IEntity): void;

    /** 
     * @param entity the entity to update, must have a valid logicalName and id must exist
    **/
    replaceEntity(entity: IEntity): void;

    /** 
     * @param logicalName the logicalName of the entity from where the query will be created
     * @returns an IEnumerable of entities where you could construct your own query with filters, projections, etc
    **/
    createQuery(logicalName: string): Enumerable.IEnumerable<IEntity>;
}

    



