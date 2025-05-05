from modeltranslation.translator import register, TranslationOptions
from .models import Category, Product, CharacteristicType, ProductCharacteristic


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(CharacteristicType)
class CharacteristicTypeTranslationOptions(TranslationOptions):
    fields = ("name", "suffix")


@register(ProductCharacteristic)
class ProductCharacteristicTranslationOptions(TranslationOptions):
    fields = ("value",)
