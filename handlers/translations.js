const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const validate = require("../utils/validator");
const mailSender = require("../utils/mailSender");

const { Greetings } = require("../models");
const { catchError, verificationGenerator } = require("../utils/serverFunctions");

exports.searchTranslation = async (req, res) => {
  try {
    const { sourceText, sourceLanguage, translationLanguage } = req.body;

    const projectLanguage =
      translationLanguage === "French" ? { french: 1 } : translationLanguage === "Spanish" ? { spanish: 1 } : { english: 1 };

    // const projectLanguage = {
    //   french: 1,
    //   english: 1,
    //   spanish: 1,
    //   score: { $meta: "searchScore" },
    // };

    // if (sourceText.length > 6) {
    //   const exactMatch = await Greetings.findOne({ [sourceLanguage.toLowerCase()]: sourceText });

    //   // temporary fix for equal search score
    //   if (exactMatch) {
    //     return res.status(200).json({ translation: exactMatch[`${translationLanguage.toLowerCase()}`], id: exactMatch._id });
    //   }
    // }

    const searchOptionForLessCharacters = [
      {
        $search: {
          phrase: {
            query: sourceText,
            path: sourceLanguage.toLowerCase(),
          },
        },
      },
      { $project: { ...projectLanguage } },
      { $limit: 1 },
    ];

    const searchOptionForMoreCharacters = [
      {
        index: "greaterThanSixChar",
        $search: {
          compound: {
            must: [
              {
                text: {
                  query: sourceText,
                  path: sourceLanguage.toLowerCase(),
                  score: { boost: { value: 5 } },
                },
              },
              {
                autocomplete: {
                  query: sourceText,
                  path: sourceLanguage.toLowerCase(),
                  // fuzzy: { maxEdits: 1.0 },
                },
              },
            ],
          },
        },
      },
      { $project: { ...projectLanguage } },
      { $limit: 1 },
    ];

    // const result = await Greetings.aggregate(searchQuery, { cursor: { batchSize: 1 } }).toArray();

    const result =
      sourceText.length > 6
        ? await Greetings.aggregate(searchOptionForLessCharacters).toArray()
        : await Greetings.aggregate(searchOptionForMoreCharacters).toArray();

    const id = result && result[0] ? result[0]._id : null,
      translation = result && result[0] ? result[0][`${translationLanguage.toLowerCase()}`] : "no translation found";

    // res.status(200).json({ translation: "no translation found" });

    res.status(200).json({ translation, id });
  } catch (err) {
    return catchError({ res, err, message: "An error occured" });
  }
};

exports.suggestTranslation = async (req, res) => {
  try {
    const { sourceText, sourceLanguage, translationText, translationLanguage, translationId, suggestedTranslation } = req.body;

    const { Suggestions } = await require("@db").default();

    await Suggestions.insertOne({
      sourceText,
      sourceLanguage,
      translationText,
      translationLanguage,
      translationId,
      suggestedTranslation,
    });

    res.status(200).json("successful");
  } catch (err) {
    return catchError({ res, err, message: "An error occured" });
  }
};

exports.starter = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    return catchError({ res, err, message: "An error occured" });
  }
};
