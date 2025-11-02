import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  const config = new DocumentBuilder()
    .setTitle('Bookshelf API')
    .setDescription('Complete REST API for managing books, authors, and categories. Supports full CRUD operations for all entities.')
    .setVersion('1.0')
    .addTag('books', 'Operations for managing books')
    .addTag('authors', 'Operations for managing authors')
    .addTag('categories', 'Operations for managing categories')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    extraModels: [],
  });
  
  if (document.components) {
    delete document.components.schemas;
  }
  if (document.paths) {
    Object.keys(document.paths).forEach(path => {
      Object.keys(document.paths[path]).forEach(method => {
        const operation = document.paths[path][method];
        if (operation?.requestBody?.content) {
          Object.keys(operation.requestBody.content).forEach(contentType => {
            const schema = operation.requestBody.content[contentType].schema;
            if (schema?.$ref) {
              operation.requestBody.content[contentType].schema = {
                type: 'object',
                properties: {},
              };
            }
          });
        }
        if (operation?.responses) {
          Object.keys(operation.responses).forEach(statusCode => {
            const response = operation.responses[statusCode];
            if (response?.content) {
              Object.keys(response.content).forEach(contentType => {
                const schema = response.content[contentType].schema;
                if (schema?.$ref) {
                  const refName = schema.$ref.split('/').pop();
                  if (['CreateAuthorDto', 'UpdateAuthorDto', 'CreateCategoryDto', 'UpdateCategoryDto'].includes(refName)) {
                    response.content[contentType].schema = {
                      type: 'object',
                      properties: {},
                    };
                  }
                }
              });
            }
          });
        }
      });
    });
  }
  
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Bookshelf API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none !important; }
      section.block.col-12:has(section.models) { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; position: absolute !important; }
      .swagger-ui section.block.col-12:has(section.models) { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; position: absolute !important; }
      section.models { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }
      section.models.is-open { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }
      .swagger-ui section.models { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }
      .swagger-ui section.models.is-open { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }
      div.wrapper:has(> section.block.col-12:has(section.models)) { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }
      .swagger-ui div.wrapper:has(> section.block.col-12:has(section.models)) { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }
    `,
    customJs: `
      (function() {
        function removeSchemasSection() {
          var allH4 = document.querySelectorAll('h4');
          for (var i = 0; i < allH4.length; i++) {
            var h4 = allH4[i];
            var text = (h4.textContent || h4.innerText || '').toLowerCase().trim();
            if (text === 'schemas') {
              var parentSection = h4.closest('section.block');
              if (parentSection) {
                parentSection.remove();
              } else {
                var modelsSection = h4.closest('section.models');
                if (modelsSection) {
                  var blockParent = modelsSection.closest('section.block');
                  if (blockParent) {
                    blockParent.remove();
                  } else {
                    modelsSection.remove();
                  }
                }
              }
            }
          }
          
          var modelsSections = document.querySelectorAll('section.models');
          for (var j = 0; j < modelsSections.length; j++) {
            var models = modelsSections[j];
            var blockSection = models.closest('section.block');
            if (blockSection) {
              blockSection.remove();
            } else {
              models.remove();
            }
          }
          
          var allBlockSections = document.querySelectorAll('section.block');
          for (var k = 0; k < allBlockSections.length; k++) {
            var block = allBlockSections[k];
            if (block.querySelector('section.models') || block.textContent.toLowerCase().indexOf('schema') >= 0) {
              block.remove();
            }
          }
        }
        
        removeSchemasSection();
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', removeSchemasSection);
        }
        
        window.addEventListener('load', function() {
          removeSchemasSection();
          setTimeout(removeSchemasSection, 50);
          setTimeout(removeSchemasSection, 200);
          setTimeout(removeSchemasSection, 500);
          setTimeout(removeSchemasSection, 1000);
          setTimeout(removeSchemasSection, 2000);
        });
        
        var observer = new MutationObserver(function() {
          removeSchemasSection();
        });
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        }
        
        var checkSwagger = setInterval(function() {
          if (document.querySelector('.swagger-ui')) {
            removeSchemasSection();
            clearInterval(checkSwagger);
          }
        }, 100);
      })();
    `,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}

bootstrap();
