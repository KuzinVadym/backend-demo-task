import { getConnection, getManager, getRepository } from 'typeorm';

export async function truncateTables(): Promise<void> {
  const entities = getConnection().entityMetadatas;
  try {
    if (getConnection()) {
      for (const entity of entities) {
        await getManager().transaction(async (transactionalEntityManager) => {
          await transactionalEntityManager.query(`SET FOREIGN_KEY_CHECKS=0;`);
          await transactionalEntityManager.query(
            `DELETE FROM \`${entity.tableName}\`;`
          );
          await transactionalEntityManager.query(`SET FOREIGN_KEY_CHECKS=1;`);
        });
      }
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}
