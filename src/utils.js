export class DecoratorUtils {
    static addInjections(cls, newInjections) {
        var injectionsProperty = Object.getOwnPropertyDescriptor(cls, 'injections');
        var oldInjectionsGetter = injectionsProperty.get;

        Object.defineProperty(cls, 'injections', {
            get: () => {
                var injections = oldInjectionsGetter();
                for (let binding of Object.keys(newInjections)) {
                    if (injections[binding] === undefined) {
                        injections[binding] = newInjections[binding];
                    }
                }
                return injections;
            }
        });
    }

    static intercept(obj, decorator, methodName) {
        Object.defineProperty(obj, methodName, {
            configurable: true,
            writeable: true,
            value: (function(originalMethod) {
                var args = Array.from(arguments).slice(1);
                var retVal = decorator[methodName].apply(decorator, args);
                if (originalMethod instanceof Function) {
                    args.push(retVal);
                    retVal = originalMethod.apply(obj, args);
                }
                return retVal;
            }).bind(decorator, obj[methodName])
        });
    }

    static sequence(obj, decorator, methodName) {
        Object.defineProperty(obj, methodName, {
            configurable: true,
            writeable: true,
            value: (function(originalMethod) {
                var args = Array.from(arguments).slice(1);
                if (originalMethod instanceof Function) {
                    args.push(originalMethod.apply(obj, args));
                }
                return decorator[methodName].apply(decorator, args);
            }).bind(decorator, obj[methodName])
        });
    }

    static addDecoratorProperty(obj, decorator, propertyName) {
        Object.defineProperty(obj, propertyName, {
            get: () => {
                return decorator[propertyName];
            },
            set: (value) => {
                decorator[propertyName] = value;
            }
        });
    }

    static addDecoratorProperties(obj, decorator, properties) {
        properties.forEach((property) => {
            DecoratorUtils.addDecoratorProperty(obj, decorator, property);
        });
    }
}

export default DecoratorUtils;
